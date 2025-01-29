# Deployment Guide - Ubuntu Server

This guide explains how to deploy the Links API as a systemd service on Ubuntu Server.

## Prerequisites

- Ubuntu Server (18.04 or later)
- Node.js installed
- Git (optional, for cloning the repository)

## Installation Steps

1. First, ensure Node.js is installed:
```bash
# Check Node.js version
node --version

# If Node.js is not installed, you can install it using:
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

2. Create a directory for the application and copy the files:
```bash
# Create directory (adjust path as needed)
mkdir -p /opt/links-api

# Copy your application files to this directory
cp app.js /opt/links-api/
cp package.json /opt/links-api/

# Install dependencies
cd /opt/links-api
npm install
```

3. Create the systemd service file:
```bash
sudo nano /etc/systemd/system/links-api.service
```

4. Add the following content to the service file (adjust the paths and user as needed):
```ini
[Unit]
Description=Links API Service
After=network.target

[Service]
Type=simple
User=your_username
WorkingDirectory=/opt/links-api
ExecStart=/usr/bin/node app.js
Restart=on-failure
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
```

5. Set proper permissions:
```bash
# Set ownership (replace 'your_username' with your actual username)
sudo chown -R your_username:your_username /opt/links-api

# Set proper file permissions
sudo chmod 755 /opt/links-api
```

6. Enable and start the service:
```bash
# Reload systemd to recognize the new service
sudo systemctl daemon-reload

# Enable the service to start on boot
sudo systemctl enable links-api

# Start the service
sudo systemctl start links-api
```

## Service Management Commands

- Check service status:
```bash
sudo systemctl status links-api
```

- Stop the service:
```bash
sudo systemctl stop links-api
```

- Restart the service:
```bash
sudo systemctl restart links-api
```

- View logs:
```bash
# View all logs
sudo journalctl -u links-api

# View recent logs and follow new entries
sudo journalctl -u links-api -f

# View logs since last boot
sudo journalctl -u links-api -b
```

## Troubleshooting

1. If the service fails to start:
   - Check logs using `sudo journalctl -u links-api -n 50`
   - Verify paths in the service file are correct
   - Ensure Node.js is installed and accessible
   - Check file permissions

2. If the API is not accessible:
   - Verify the service is running: `sudo systemctl status links-api`
   - Check if the port is open: `sudo ss -tulpn | grep 3000`
   - Ensure firewall allows the port: `sudo ufw status`

## Notes

- The service will automatically restart if it crashes
- Logs are managed by systemd's journald
- The service will start automatically when the server boots
- Make sure to replace `your_username` with your actual username in the service file

## File Locations

- Application: `/opt/links-api/`
- Service file: `/etc/systemd/system/links-api.service`
- Logs: Access via `journalctl`
