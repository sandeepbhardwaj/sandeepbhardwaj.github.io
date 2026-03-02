#!/usr/bin/env ruby
# frozen_string_literal: true

require "date"
require "yaml"

def parse_front_matter(path)
  content = File.read(path)
  match = content.match(/\A---\s*\n(.*?)\n---\s*\n/m)
  return {} unless match

  YAML.safe_load(match[1], permitted_classes: [Date, Time], aliases: true) || {}
rescue StandardError
  {}
end

def parse_post_date(path, front_matter)
  value = front_matter["date"]
  return Date.parse(value.to_s) if value

  filename = File.basename(path)
  Date.strptime(filename[0, 10], "%Y-%m-%d")
rescue StandardError
  nil
end

def note(message)
  puts "::notice ::#{message}"
end

def warn_msg(message)
  puts "::warning ::#{message}"
end

posts = Dir["_posts/*.md"].sort
if posts.empty?
  warn_msg("No posts found in _posts directory.")
  exit 0
end

# Keep schedule checks aligned with site timezone (Asia/Kolkata).
today = Time.now.getlocal("+05:30").to_date
records = posts.filter_map do |path|
  fm = parse_front_matter(path)
  date = parse_post_date(path, fm)
  next unless date

  { path: path, date: date }
end

published = records.select { |row| row[:date] <= today }
upcoming = records.select { |row| row[:date] > today }
recent_window_start = today - 14
recent_published = published.select { |row| row[:date] >= recent_window_start }

note("Post schedule summary for #{today}: #{published.size} published, #{upcoming.size} upcoming.")

if upcoming.any?
  next_posts = upcoming.sort_by { |row| row[:date] }.first(5)
  note("Upcoming posts: #{next_posts.map { |row| "#{row[:date]} (#{File.basename(row[:path])})" }.join(', ')}")
end

if recent_published.empty? && upcoming.any?
  warn_msg("No posts published in the last 14 days while upcoming future-dated posts exist.")
end

summary_file = ENV["GITHUB_STEP_SUMMARY"]
if summary_file && !summary_file.empty?
  File.open(summary_file, "a") do |f|
    f.puts "## Content Schedule Check"
    f.puts "- Today (IST): #{today}"
    f.puts "- Published posts: #{published.size}"
    f.puts "- Upcoming posts: #{upcoming.size}"
    unless upcoming.empty?
      f.puts "- Next up: #{upcoming.min_by { |row| row[:date] }[:date]}"
    end
  end
end
