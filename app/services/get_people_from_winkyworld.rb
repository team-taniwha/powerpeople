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
      winkyworld_id: json["id"],
      name: json["attributes"]["Name"],
      image_url: json["avatar_large"],
      position: json["attributes"]["Position"],
      bio: json["attributes"]["Bio"],
      city: json["attributes"]["Group"],
    )
  end

  attr_reader :name, :image_url, :position, :bio, :city, :winkyworld_id

  def initialize(name:, image_url:, position:, bio:, city:, winkyworld_id:)
    @winkyworld_id = winkyworld_id
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
