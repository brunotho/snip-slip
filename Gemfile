source "https://rubygems.org"

ruby "3.2.2"

gem "rails", "~> 7.2.1", ">= 7.2.1.2"

gem "sprockets-rails"
gem "pg", "~> 1.1"
gem "puma", ">= 5.0"
gem "jsbundling-rails"
gem "turbo-rails"
gem "stimulus-rails"
gem "cssbundling-rails"
gem "jbuilder"
gem "tzinfo-data", platforms: %i[ windows jruby ]
gem "bootsnap", require: false

gem "devise"
gem "simple_form"
gem "react-rails"
gem "cloudinary"
gem "httparty"
# gem "sidekiq"

group :development, :test do
  gem "debug", platforms: %i[ mri windows ], require: "debug/prelude"

  gem "brakeman", require: false

  gem "rubocop-rails-omakase", require: false

  gem "rspec-rails"
  gem "factory_bot_rails"
end

group :test do
  gem "capybara"
  gem "shoulda-matchers"
  # gem "simplecov", require: false
end

group :development do
  gem "annotate"
  gem "web-console"
  gem "dotenv-rails"
end
