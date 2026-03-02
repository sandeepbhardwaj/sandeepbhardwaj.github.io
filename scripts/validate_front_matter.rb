#!/usr/bin/env ruby
# frozen_string_literal: true

require "yaml"
require "date"

REQUIRED_KEYS = %w[title date categories tags seo_title seo_description].freeze

errors = []

Dir["_posts/*.md"].sort.each do |path|
  content = File.read(path)
  match = content.match(/\A---\s*\n(.*?)\n---\s*\n/m)

  if match.nil?
    errors << "#{path}: missing front matter block"
    next
  end

  front_matter = YAML.safe_load(match[1], permitted_classes: [Date, Time], aliases: true)
  unless front_matter.is_a?(Hash)
    errors << "#{path}: front matter is not a valid mapping"
    next
  end

  REQUIRED_KEYS.each do |key|
    value = front_matter[key]
    if value.nil? || (value.respond_to?(:empty?) && value.empty?)
      errors << "#{path}: missing required key '#{key}'"
    end
  end

  header = front_matter["header"]
  if !header.is_a?(Hash) || header["overlay_image"].to_s.strip.empty?
    errors << "#{path}: missing required key 'header.overlay_image'"
  end

  categories = front_matter["categories"]
  unless categories.is_a?(Array) || categories.is_a?(String)
    errors << "#{path}: 'categories' should be a list or string"
  end

  tags = front_matter["tags"]
  unless tags.is_a?(Array) || tags.is_a?(String)
    errors << "#{path}: 'tags' should be a list or string"
  end
end

if errors.empty?
  puts "Front matter validation passed for #{Dir['_posts/*.md'].size} posts."
  exit 0
end

puts "Front matter validation failed:"
errors.each { |error| puts "- #{error}" }
exit 1
