# Group Guard Bot

Group Guard is a smart Telegram moderation bot designed to automatically detect, warn, and remove users who post sexual solicitation, hookup spam, and related inappropriate content in Telegram groups.

The bot is optimized for real-world spam patterns, including Kenyan slang, misspellings, and context-based detection.

Created by Kentom
[https://kentom.co.ke](https://kentom.co.ke)

---

## Features

* Automatically detects sexual solicitation messages
* Context-aware filtering using keyword combinations
* Supports English, Swahili, Sheng, and common misspellings
* Deletes offending messages immediately
* Issues a warning on first offense
* Automatically removes users on repeated offenses
* Handles phone numbers, WhatsApp bait, VC spam, and price-based offers
* Lightweight and fast
* Easy to deploy and customize

---

## How the Bot Works

The bot does not rely on single keywords alone. Instead, it analyzes message context using grouped keywords.

### Detection Logic Summary

A message is flagged if it matches combinations such as:

* Sexual intent + call to action
  Example: horny + dm, smash + inbox

* Video or VC references + call to action
  Example: video call + dm, vc + inbox

* Commercial offers + sexual context
  Example: sugar mummy + video, nightstand + dm

* Phone numbers combined with solicitation context

Some explicit slang terms trigger an immediate violation even if used alone.

This approach greatly reduces false positives while catching real spam.

---

## Requirements

* Node.js version 16 or higher
* A Telegram bot token
* A Telegram group where you have admin rights

---

## Getting a Bot Token

1. Open Telegram
2. Search for BotFather
3. Start a chat with BotFather
4. Send the command:

   ```
   /newbot
   ```
5. Follow the prompts to choose a name and username
6. Copy the bot token provided

Keep this token private.

---

## Adding the Bot to a Group

1. Open your Telegram group
2. Add the bot as a member
3. Promote the bot to administrator
4. Grant the following permissions:

   * Delete messages
   * Ban users
   * Restrict members

Without these permissions, the bot will not function correctly.

---

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/your-repo/group-guard-bot.git
cd group-guard-bot
npm install
```

---

## Environment Configuration

Create a `.env` file in the project root:

```env
BOT_TOKEN=YOUR_TELEGRAM_BOT_TOKEN
```

---

## Running the Bot

Start the bot using:

```bash
node index.js
```

If everything is configured correctly, the bot will begin moderating immediately.

---

## Moderation Flow

1. A user sends a message
2. The bot analyzes the message content
3. If a violation is detected:

   * The message is deleted
   * The user receives a warning
4. If the same user violates again:

   * The user is removed from the group

Warnings are stored in memory by default. Restarting the bot resets warnings.

---

## Customization

You can easily customize the bot by editing the keyword groups in `index.js`:

* intentWords: sexual intent indicators
* actionWords: calls to action such as dm or inbox
* mediaWords: video and VC references
* commercialWords: pricing and offer indicators
* hardBanWords: explicit terms that trigger immediate action

You can also adjust the punishment logic to mute users instead of banning them.

---

## Limitations

* Warnings are stored in memory only
* Restarting the bot clears warning history
* The bot does not currently differentiate admins unless added manually
* No dashboard or UI included

---

## Recommended Enhancements

For production or large groups, consider adding:

* Persistent storage (Redis or MongoDB)
* Temporary mute before ban
* Admin whitelist
* Spam repetition detection
* AI-based moderation fallback
* Deployment on a VPS or cloud service

Kentom can assist with advanced customization and deployment.

---

## Deployment

The bot can be deployed on:

* VPS (recommended for stability)
* Railway
* Render
* Fly.io

For free-tier hosting, ensure the service supports long-running processes.

---

## Security Notes

* Never commit your bot token to version control
* Rotate the token if it is ever exposed
* Restrict admin permissions to trusted users only

---

## License

MIT License

---

## Author

Group Guard Bot
Created by Kentom
[https://kentom.co.ke](https://kentom.co.ke)

For customization, deployment, or enterprise moderation solutions, contact via kentom.co.ke.
