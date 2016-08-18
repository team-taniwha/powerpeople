# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160818023101) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "flashcards", force: :cascade do |t|
    t.integer  "user_id"
    t.integer  "staff_member_id"
    t.datetime "created_at",                    null: false
    t.datetime "updated_at",                    null: false
    t.float    "easiness_factor", default: 2.5
    t.integer  "repetitions",     default: 0
    t.integer  "interval",        default: 0
    t.date     "due"
    t.date     "studied_at"
  end

  create_table "staff_members", force: :cascade do |t|
    t.string   "name"
    t.text     "bio"
    t.string   "image_url"
    t.string   "position"
    t.string   "city"
    t.datetime "created_at",          null: false
    t.datetime "updated_at",          null: false
    t.string   "winkyworld_id",       null: false
    t.date     "employment_end_date"
  end

  create_table "users", force: :cascade do |t|
    t.string   "email"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

end
