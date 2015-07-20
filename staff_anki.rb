require 'pp'
require 'httparty'

class StaffAnkiGenerator
  include HTTParty

  base_uri "https://powershopwinky.papyrs.com/api/v1"

  def people_with_pictures_in_wellington
    JSON.parse(self.class.get(people_url).body)
      .map { |person| Staff.from_json(person) }
      .select(&:has_profile_picture?)
      .select(&:in_wellington?)
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

  def initialize(name:, image_url:, position:, bio:, city:)
    @name = name
    @image_url = image_url
    @position = position
    @bio = bio
    @city = city
  end

  def to_csv_row
    [front_html, back_html]
  end

  def has_profile_picture?
    !@image_url.include? "default"
  end

  def in_wellington?
    @city == "Wellington"
  end

  private

  def front_html
    <<-HTML.strip
      <img src="#{@image_url}" width="300"/>
    HTML
  end

  def back_html
    <<-HTML.strip
      <h3>#{@name}</h3>
      <h4>#{@position}</h4>
      <p>#{@bio}</p>
    HTML
  end
end

if __FILE__ == $0
  unless ENV['WINKY_AUTH_TOKEN']
    raise 'Please set WINKY_AUTH_TOKEN'
  end
  staff = StaffAnkiGenerator.new.people_with_pictures_in_wellington.shuffle

  CSV.open("staff.csv", "wb") do |csv|
    staff.each { |person| csv << person.to_csv_row }
  end

  puts "Wrote #{staff.count} staff to staff.csv"
end
