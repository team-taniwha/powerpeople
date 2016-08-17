require 'pp'
require 'httparty'

MASTERTON = "Masterton"
HANSON = "Wgtn - Hanson st"
TORY = "Wgtn - Tory st"
MELBOURNE = "Melbourne"
BIRMINGHAM = "Birmingham"

CITIES = [
  MASTERTON,
  HANSON,
  TORY,
  MELBOURNE,
  BIRMINGHAM
]

class GetPeopleFromWinkyworld
  include HTTParty

  base_uri "https://powershopwinky.papyrs.com/api/v1"

  def call
    unless ENV['WINKY_AUTH_TOKEN']
      raise 'Please set WINKY_AUTH_TOKEN'
    end

    people_with_pictures_in_wellington
  end

  private

  def update_or_create_staff_member(person)
    existing_staff_member = StaffMember.find_by(name: person.name)
    staff_member = StaffMember.find_or_initialize_by(name: person.name)

    staff_member.update_attributes!(
      :bio => person.bio,
      :image_url => person.image_url,
      :position => person.position,
      :city => person.city
    )
  end

  def people_with_pictures_in_wellington
    JSON.parse(self.class.get(people_url).body)
      .map { |person| Staff.from_json(person) }
      .select(&:has_profile_picture?)
      .select(&:works_at_hanson_st?)
  end

  private

  def auth_token
    ENV['WINKY_AUTH_TOKEN']
  end

  def people_url
    "/people/all/?auth_token=#{auth_token}"
  end
end

class Staff
  def self.from_json(json)
    new(
      name: json["attributes"]["Name"],
      image_url: json["avatar_large"],
      position: json["attributes"]["Position"],
      bio: json["attributes"]["Bio"],
      city: json["attributes"]["Group"],
    )
  end

  attr_reader :name, :image_url, :position, :bio, :city

  def initialize(name:, image_url:, position:, bio:, city:)
    @name = name
    @image_url = image_url
    @position = position
    @bio = bio
    @city = city
  end

  def has_profile_picture?
    !@image_url.include? "default"
  end

  # TODO - support more than just HANSON
  def works_at_hanson_st?
    @city == HANSON
  end
end
