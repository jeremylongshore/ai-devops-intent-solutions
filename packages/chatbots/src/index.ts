/**
 * Intent Blueprint Chat Integrations
 * Slack and Discord bots for doc generation with download/email delivery
 */

export { SlackBot } from './slack/app.js';
export { DiscordBot } from './discord/app.js';
export { DocDelivery, type DeliveryOptions } from './shared/delivery.js';
export { DocGenerator, type GeneratorOptions } from './shared/generator.js';
