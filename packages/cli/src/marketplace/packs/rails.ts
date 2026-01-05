/**
 * Ruby on Rails Template Pack
 * Templates optimized for Rails applications
 */

import type { CustomTemplate } from '../../enterprise/templates/types.js';

export const RAILS_TEMPLATES: CustomTemplate[] = [
  {
    meta: {
      id: 'rails-prd',
      name: 'Rails Product Requirements',
      description: 'PRD template optimized for Ruby on Rails applications',
      version: '1.0.0',
      category: 'product',
      scope: 'standard',
      author: 'Intent Solutions',
      tags: ['rails', 'ruby', 'web', 'prd'],
    },
    variables: [
      { name: 'projectName', label: 'Project Name', type: 'string', required: true },
      { name: 'projectDescription', label: 'Description', type: 'text', required: true },
      { name: 'railsVersion', label: 'Rails Version', type: 'select', options: [
        { label: 'Rails 7.1+ (latest)', value: '7.1' },
        { label: 'Rails 7.0', value: '7.0' },
        { label: 'Rails 6.1 (LTS)', value: '6.1' },
      ], default: '7.1' },
      { name: 'appType', label: 'Application Type', type: 'select', options: [
        { label: 'Full-stack (Hotwire)', value: 'hotwire' },
        { label: 'API Only', value: 'api' },
        { label: 'API + React SPA', value: 'react' },
        { label: 'API + Vue SPA', value: 'vue' },
      ]},
      { name: 'database', label: 'Database', type: 'select', options: [
        { label: 'PostgreSQL', value: 'postgres' },
        { label: 'MySQL', value: 'mysql' },
        { label: 'SQLite', value: 'sqlite' },
      ], default: 'postgres' },
      { name: 'features', label: 'Features', type: 'multiselect', options: [
        { label: 'Authentication (Devise)', value: 'devise' },
        { label: 'Authorization (Pundit)', value: 'pundit' },
        { label: 'Background Jobs (Sidekiq)', value: 'sidekiq' },
        { label: 'Action Cable (WebSockets)', value: 'actioncable' },
        { label: 'Active Storage (File Upload)', value: 'activestorage' },
        { label: 'Action Mailer (Email)', value: 'actionmailer' },
        { label: 'API Versioning', value: 'api_versioning' },
        { label: 'Pagination (Pagy)', value: 'pagination' },
      ]},
      { name: 'deployment', label: 'Deployment', type: 'select', options: [
        { label: 'Heroku', value: 'heroku' },
        { label: 'Render', value: 'render' },
        { label: 'Railway', value: 'railway' },
        { label: 'Docker/Kubernetes', value: 'docker' },
        { label: 'AWS (Elastic Beanstalk)', value: 'aws' },
      ]},
    ],
    sections: [
      {
        id: 'overview',
        title: 'Product Overview',
        order: 1,
        content: `# {{projectName}}

## Overview
{{projectDescription}}

### Technology Stack
- **Framework:** Ruby on Rails {{railsVersion}}
- **Application Type:** {{appType}}
- **Database:** {{database}}
- **Deployment:** {{deployment}}

### Key Features
{{#each features}}
- {{this}}
{{/each}}`,
      },
      {
        id: 'architecture',
        title: 'Technical Architecture',
        order: 2,
        content: `## Technical Architecture

### Project Structure
\`\`\`
{{projectName}}/
├── app/
│   ├── controllers/
│   │   ├── application_controller.rb
│   │   ├── api/v1/           # API controllers
│   │   └── concerns/
│   ├── models/
│   │   ├── application_record.rb
│   │   └── concerns/
│   ├── views/
│   │   ├── layouts/
│   │   └── components/       # ViewComponent
{{#if (equals appType "hotwire")}}
│   ├── javascript/
│   │   ├── controllers/      # Stimulus
│   │   └── application.js
{{/if}}
│   ├── jobs/                 # ActiveJob
│   ├── mailers/
│   ├── services/             # Service objects
│   └── policies/             # Pundit policies
├── config/
│   ├── routes.rb
│   ├── database.yml
│   └── environments/
├── db/
│   ├── migrate/
│   └── seeds.rb
├── spec/                     # RSpec tests
└── Gemfile
\`\`\`

### Design Principles
- **Convention over Configuration**
- **Service Objects** for complex business logic
- **Query Objects** for complex queries
- **Form Objects** for complex forms
- **Presenters/Decorators** for view logic`,
      },
      {
        id: 'routes',
        title: 'Routes & Endpoints',
        order: 3,
        content: `## Routes

### RESTful Routes
\`\`\`ruby
# config/routes.rb
Rails.application.routes.draw do
  root "home#index"

{{#if (contains features "devise")}}
  devise_for :users
{{/if}}

{{#if (equals appType "api")}}
  namespace :api do
    namespace :v1 do
      resources :users, only: [:index, :show, :create, :update]
      resources :posts do
        resources :comments, shallow: true
      end
    end
  end
{{else}}
  resources :posts do
    resources :comments, shallow: true
    member do
      post :publish
    end
  end

  resources :users, only: [:show, :edit, :update]
{{/if}}

{{#if (contains features "sidekiq")}}
  require "sidekiq/web"
  mount Sidekiq::Web => "/sidekiq"
{{/if}}
end
\`\`\`

### Route Helpers
| Path | Helper |
|------|--------|
| /posts | posts_path |
| /posts/:id | post_path(post) |
| /posts/new | new_post_path |
| /posts/:id/edit | edit_post_path(post) |`,
      },
      {
        id: 'models',
        title: 'Data Models',
        order: 4,
        content: `## Data Models

### Core Models
\`\`\`ruby
# app/models/user.rb
class User < ApplicationRecord
{{#if (contains features "devise")}}
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
{{/if}}

  has_many :posts, dependent: :destroy
  has_many :comments

{{#if (contains features "activestorage")}}
  has_one_attached :avatar
{{/if}}

  validates :name, presence: true
  validates :email, presence: true, uniqueness: { case_sensitive: false }

  scope :active, -> { where(active: true) }
  scope :recent, -> { order(created_at: :desc) }
end

# app/models/post.rb
class Post < ApplicationRecord
  belongs_to :user
  has_many :comments, dependent: :destroy
{{#if (contains features "activestorage")}}
  has_many_attached :images
{{/if}}

  enum status: { draft: 0, published: 1, archived: 2 }

  validates :title, presence: true, length: { maximum: 200 }
  validates :body, presence: true

  scope :published, -> { where(status: :published) }
end
\`\`\`

### Database Schema
| Table | Columns |
|-------|---------|
| users | id, email, name, created_at |
| posts | id, user_id, title, body, status, created_at |
| comments | id, post_id, user_id, body, created_at |`,
      },
      {
        id: 'auth',
        title: 'Authentication',
        order: 5,
        condition: { variable: 'features', operator: 'contains', value: 'devise' },
        content: `## Authentication (Devise)

### Configuration
\`\`\`ruby
# config/initializers/devise.rb
Devise.setup do |config|
  config.mailer_sender = 'noreply@{{projectName}}.com'
  config.case_insensitive_keys = [:email]
  config.strip_whitespace_keys = [:email]
  config.skip_session_storage = [:http_auth]
  config.stretches = Rails.env.test? ? 1 : 12
  config.reconfirmable = true
  config.expire_all_remember_me_on_sign_out = true
  config.password_length = 8..128
  config.email_regexp = /\\A[^@\\s]+@[^@\\s]+\\z/
  config.timeout_in = 30.minutes
  config.lock_strategy = :failed_attempts
  config.unlock_strategy = :both
  config.maximum_attempts = 5
end
\`\`\`

### Controller Helpers
\`\`\`ruby
# In controllers
before_action :authenticate_user!
current_user
user_signed_in?
user_session
\`\`\`

{{#if (equals appType "api")}}
### JWT Authentication (for API)
\`\`\`ruby
# app/controllers/api/v1/base_controller.rb
class Api::V1::BaseController < ApplicationController
  before_action :authenticate_user!

  private

  def authenticate_user!
    token = request.headers['Authorization']&.split(' ')&.last
    @current_user = User.find_by_token(token)
    render json: { error: 'Unauthorized' }, status: :unauthorized unless @current_user
  end
end
\`\`\`
{{/if}}`,
      },
      {
        id: 'jobs',
        title: 'Background Jobs',
        order: 6,
        condition: { variable: 'features', operator: 'contains', value: 'sidekiq' },
        content: `## Background Jobs (Sidekiq)

### Configuration
\`\`\`ruby
# config/initializers/sidekiq.rb
Sidekiq.configure_server do |config|
  config.redis = { url: ENV['REDIS_URL'] }
end

Sidekiq.configure_client do |config|
  config.redis = { url: ENV['REDIS_URL'] }
end
\`\`\`

### Job Example
\`\`\`ruby
# app/jobs/send_notification_job.rb
class SendNotificationJob < ApplicationJob
  queue_as :default
  retry_on StandardError, wait: :exponentially_longer, attempts: 3

  def perform(user_id, message)
    user = User.find(user_id)
    NotificationService.new(user).send(message)
  end
end

# Usage
SendNotificationJob.perform_later(user.id, "Hello!")
SendNotificationJob.set(wait: 1.hour).perform_later(user.id, "Reminder")
\`\`\`

### Queue Configuration
\`\`\`yaml
# config/sidekiq.yml
:concurrency: 5
:queues:
  - critical
  - default
  - low
\`\`\``,
      },
      {
        id: 'hotwire',
        title: 'Hotwire (Turbo + Stimulus)',
        order: 7,
        condition: { variable: 'appType', operator: 'equals', value: 'hotwire' },
        content: `## Hotwire Integration

### Turbo Frames
\`\`\`erb
<!-- app/views/posts/index.html.erb -->
<%= turbo_frame_tag "posts" do %>
  <% @posts.each do |post| %>
    <%= render post %>
  <% end %>
<% end %>

<!-- app/views/posts/_post.html.erb -->
<%= turbo_frame_tag dom_id(post) do %>
  <article>
    <h2><%= link_to post.title, post %></h2>
    <p><%= post.body.truncate(200) %></p>
    <%= link_to "Edit", edit_post_path(post) %>
  </article>
<% end %>
\`\`\`

### Turbo Streams
\`\`\`ruby
# app/controllers/posts_controller.rb
def create
  @post = current_user.posts.build(post_params)
  if @post.save
    respond_to do |format|
      format.turbo_stream
      format.html { redirect_to @post }
    end
  else
    render :new, status: :unprocessable_entity
  end
end

# app/views/posts/create.turbo_stream.erb
<%= turbo_stream.prepend "posts", @post %>
<%= turbo_stream.update "post_form", partial: "form", locals: { post: Post.new } %>
\`\`\`

### Stimulus Controller
\`\`\`javascript
// app/javascript/controllers/form_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["input", "submit"]
  static values = { submitting: Boolean }

  connect() {
    this.validate()
  }

  validate() {
    const isValid = this.inputTargets.every(input => input.value.trim())
    this.submitTarget.disabled = !isValid
  }

  submit(event) {
    if (this.submittingValue) {
      event.preventDefault()
      return
    }
    this.submittingValue = true
    this.submitTarget.textContent = "Saving..."
  }
}
\`\`\``,
      },
      {
        id: 'deployment',
        title: 'Deployment',
        order: 8,
        content: `## Deployment

{{#if (equals deployment "docker")}}
### Docker Configuration
\`\`\`dockerfile
# Dockerfile
FROM ruby:3.2-slim

RUN apt-get update -qq && apt-get install -y \\
    build-essential libpq-dev nodejs npm

WORKDIR /app

COPY Gemfile Gemfile.lock ./
RUN bundle install

COPY . .
RUN bundle exec rake assets:precompile

EXPOSE 3000
CMD ["bundle", "exec", "puma", "-C", "config/puma.rb"]
\`\`\`

### Docker Compose
\`\`\`yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgres://postgres:password@db:5432/app
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
  db:
    image: postgres:15
    volumes:
      - postgres:/var/lib/postgresql/data
  redis:
    image: redis:7-alpine
{{#if (contains features "sidekiq")}}
  sidekiq:
    build: .
    command: bundle exec sidekiq
    environment:
      - DATABASE_URL=postgres://postgres:password@db:5432/app
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
{{/if}}
volumes:
  postgres:
\`\`\`
{{/if}}

{{#if (equals deployment "heroku")}}
### Heroku Configuration
\`\`\`
# Procfile
web: bundle exec puma -C config/puma.rb
{{#if (contains features "sidekiq")}}
worker: bundle exec sidekiq
{{/if}}
release: bundle exec rails db:migrate
\`\`\`

\`\`\`bash
# Setup
heroku create {{projectName}}
heroku addons:create heroku-postgresql:hobby-dev
{{#if (contains features "sidekiq")}}
heroku addons:create heroku-redis:hobby-dev
{{/if}}
git push heroku main
\`\`\`
{{/if}}

### Environment Variables
\`\`\`
RAILS_ENV=production
SECRET_KEY_BASE=
DATABASE_URL=
REDIS_URL=
RAILS_MASTER_KEY=
\`\`\``,
      },
    ],
  },
  {
    meta: {
      id: 'rails-architecture',
      name: 'Rails Architecture Document',
      description: 'Technical architecture for Rails applications',
      version: '1.0.0',
      category: 'technical',
      scope: 'comprehensive',
      author: 'Intent Solutions',
      tags: ['rails', 'ruby', 'architecture'],
    },
    variables: [
      { name: 'projectName', label: 'Project Name', type: 'string', required: true },
    ],
    sections: [
      {
        id: 'overview',
        title: 'Architecture Overview',
        order: 1,
        content: `# {{projectName}} Architecture

## Architectural Patterns

### Service Objects
Extract complex business logic from controllers/models.

\`\`\`ruby
# app/services/order_processor.rb
class OrderProcessor
  def initialize(order)
    @order = order
  end

  def call
    return failure("Invalid order") unless @order.valid?

    ActiveRecord::Base.transaction do
      process_payment
      update_inventory
      send_confirmation
    end

    success(@order)
  rescue PaymentError => e
    failure(e.message)
  end

  private

  def process_payment
    PaymentGateway.charge(@order.total, @order.payment_method)
  end

  def update_inventory
    @order.line_items.each do |item|
      item.product.decrement!(:stock, item.quantity)
    end
  end

  def send_confirmation
    OrderMailer.confirmation(@order).deliver_later
  end

  def success(data)
    Result.new(success: true, data: data)
  end

  def failure(error)
    Result.new(success: false, error: error)
  end

  Result = Struct.new(:success, :data, :error, keyword_init: true) do
    def success? = success
    def failure? = !success
  end
end
\`\`\``,
      },
      {
        id: 'query-objects',
        title: 'Query Objects',
        order: 2,
        content: `## Query Objects

### Complex Queries
\`\`\`ruby
# app/queries/posts_query.rb
class PostsQuery
  def initialize(relation = Post.all)
    @relation = relation
  end

  def call(params = {})
    @relation
      .then { |r| filter_by_status(r, params[:status]) }
      .then { |r| filter_by_author(r, params[:author_id]) }
      .then { |r| filter_by_date_range(r, params[:from], params[:to]) }
      .then { |r| search(r, params[:q]) }
      .then { |r| order_by(r, params[:sort]) }
  end

  private

  def filter_by_status(relation, status)
    return relation if status.blank?
    relation.where(status: status)
  end

  def filter_by_author(relation, author_id)
    return relation if author_id.blank?
    relation.where(user_id: author_id)
  end

  def filter_by_date_range(relation, from, to)
    relation = relation.where("created_at >= ?", from) if from.present?
    relation = relation.where("created_at <= ?", to) if to.present?
    relation
  end

  def search(relation, query)
    return relation if query.blank?
    relation.where("title ILIKE ? OR body ILIKE ?", "%#{query}%", "%#{query}%")
  end

  def order_by(relation, sort)
    case sort
    when "oldest" then relation.order(created_at: :asc)
    when "popular" then relation.order(views_count: :desc)
    else relation.order(created_at: :desc)
    end
  end
end

# Usage in controller
@posts = PostsQuery.new.call(params.permit(:status, :author_id, :q, :sort))
\`\`\``,
      },
      {
        id: 'testing',
        title: 'Testing Strategy',
        order: 3,
        content: `## Testing Strategy

### Test Structure
\`\`\`
spec/
├── models/           # Unit tests
├── requests/         # API/Integration tests
├── system/           # E2E tests
├── services/         # Service object tests
├── queries/          # Query object tests
├── factories/        # FactoryBot factories
├── support/          # Test helpers
└── rails_helper.rb
\`\`\`

### Model Specs
\`\`\`ruby
# spec/models/user_spec.rb
RSpec.describe User, type: :model do
  describe "validations" do
    it { is_expected.to validate_presence_of(:email) }
    it { is_expected.to validate_uniqueness_of(:email).case_insensitive }
  end

  describe "associations" do
    it { is_expected.to have_many(:posts).dependent(:destroy) }
    it { is_expected.to have_many(:comments) }
  end

  describe "#full_name" do
    let(:user) { build(:user, first_name: "John", last_name: "Doe") }
    it { expect(user.full_name).to eq("John Doe") }
  end
end
\`\`\`

### Request Specs
\`\`\`ruby
# spec/requests/api/v1/posts_spec.rb
RSpec.describe "Posts API", type: :request do
  let(:user) { create(:user) }
  let(:headers) { { "Authorization" => "Bearer #{user.token}" } }

  describe "GET /api/v1/posts" do
    before { create_list(:post, 3) }

    it "returns all posts" do
      get "/api/v1/posts", headers: headers
      expect(response).to have_http_status(:ok)
      expect(json_response["data"].size).to eq(3)
    end
  end

  describe "POST /api/v1/posts" do
    let(:valid_params) { { post: { title: "Test", body: "Content" } } }

    it "creates a post" do
      expect {
        post "/api/v1/posts", params: valid_params, headers: headers
      }.to change(Post, :count).by(1)
      expect(response).to have_http_status(:created)
    end
  end
end
\`\`\``,
      },
    ],
  },
  {
    meta: {
      id: 'rails-testing',
      name: 'Rails Testing Strategy',
      description: 'Comprehensive testing strategy for Rails applications',
      version: '1.0.0',
      category: 'testing',
      scope: 'standard',
      author: 'Intent Solutions',
      tags: ['rails', 'ruby', 'testing', 'rspec'],
    },
    variables: [
      { name: 'projectName', label: 'Project Name', type: 'string', required: true },
    ],
    sections: [
      {
        id: 'overview',
        title: 'Testing Overview',
        order: 1,
        content: `# {{projectName}} Testing Strategy

## Testing Pyramid
- **Unit Tests:** 60% - Models, services, queries
- **Integration Tests:** 30% - Request specs, system tests
- **E2E Tests:** 10% - Critical user flows

## Tools
- **Test Framework:** RSpec
- **Factories:** FactoryBot
- **Fixtures:** Faker
- **Coverage:** SimpleCov
- **Mocking:** RSpec Mocks
- **System Tests:** Capybara + Selenium`,
      },
      {
        id: 'factories',
        title: 'Factories',
        order: 2,
        content: `## FactoryBot Factories

### Factory Definition
\`\`\`ruby
# spec/factories/users.rb
FactoryBot.define do
  factory :user do
    sequence(:email) { |n| "user#{n}@example.com" }
    name { Faker::Name.name }
    password { "password123" }
    password_confirmation { password }

    trait :admin do
      role { :admin }
    end

    trait :with_posts do
      transient do
        posts_count { 3 }
      end

      after(:create) do |user, evaluator|
        create_list(:post, evaluator.posts_count, user: user)
      end
    end
  end
end

# spec/factories/posts.rb
FactoryBot.define do
  factory :post do
    user
    title { Faker::Lorem.sentence }
    body { Faker::Lorem.paragraphs(number: 3).join("\\n\\n") }
    status { :draft }

    trait :published do
      status { :published }
      published_at { Time.current }
    end
  end
end
\`\`\`

### Usage
\`\`\`ruby
# Create
user = create(:user)
user = create(:user, :admin)
user = create(:user, :with_posts, posts_count: 5)

# Build (not persisted)
user = build(:user)

# Attributes only
attrs = attributes_for(:user)
\`\`\``,
      },
      {
        id: 'system-tests',
        title: 'System Tests',
        order: 3,
        content: `## System Tests (Capybara)

### Configuration
\`\`\`ruby
# spec/support/capybara.rb
Capybara.default_max_wait_time = 5
Capybara.server = :puma, { Silent: true }

Capybara.register_driver :selenium_chrome_headless do |app|
  options = Selenium::WebDriver::Chrome::Options.new
  options.add_argument("--headless")
  options.add_argument("--disable-gpu")
  options.add_argument("--window-size=1400,900")

  Capybara::Selenium::Driver.new(app, browser: :chrome, options: options)
end

Capybara.javascript_driver = :selenium_chrome_headless
\`\`\`

### System Test Example
\`\`\`ruby
# spec/system/posts_spec.rb
RSpec.describe "Posts", type: :system do
  let(:user) { create(:user) }

  before do
    sign_in user
  end

  it "creates a new post" do
    visit new_post_path

    fill_in "Title", with: "My New Post"
    fill_in "Body", with: "This is the content"
    click_button "Create Post"

    expect(page).to have_content("Post was successfully created")
    expect(page).to have_content("My New Post")
  end

  it "edits an existing post", js: true do
    post = create(:post, user: user, title: "Original Title")

    visit post_path(post)
    click_link "Edit"

    fill_in "Title", with: "Updated Title"
    click_button "Update Post"

    expect(page).to have_content("Updated Title")
  end
end
\`\`\``,
      },
    ],
  },
];

export default RAILS_TEMPLATES;
