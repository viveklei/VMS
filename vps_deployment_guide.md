# VPS Deployment & Operations Guide
## Target OS: Ubuntu 24.04 LTS

This guide provides instructions to prepare, deploy, and maintain the **LEI FleetOps AI** platform on a clean Ubuntu VPS.

---

## 1. System Preparation & Docker Installation

SSH into your Ubuntu server and run the following setup commands:

```bash
# Update local packages
sudo apt update && sudo apt upgrade -y

# Install prerequisite libraries
sudo apt install -y curl apt-transport-https ca-certificates gnupg lsb-release

# Add Docker’s official GPG key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Set up the repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine & Compose
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Verify Docker installation
sudo docker --version
sudo docker compose version
```

---

## 2. Deploying the FleetOps Application

Clone your project workspace and build the orchestrated network:

```bash
# Navigate to deployment directory
cd /var/www/fleetops

# Start all containers in detached mode
sudo docker compose up --build -d

# Verify running processes and health check states
sudo docker compose ps
```

---

## 3. SSL Configuration (Let's Encrypt / Certbot)

To secure user authentication and REST exchanges with HTTPS, run Nginx with certbot:

```bash
# Install Certbot and the Nginx helper plugin
sudo apt install -y certbot python3-certbot-nginx

# Request and bind the certificate
# Replace 'fleetops.lei-experts.in' with your real DNS record
sudo certbot --nginx -d fleetops.lei-experts.in

# Certbot automatically sets up a systemd timer to renew certificates. Check status:
sudo systemctl status certbot.timer
```

---

## 4. Automatic PostgreSQL Backups

Set up a nightly database backup cron job:

1. Create a script `/var/www/fleetops/backup.sh`:

```bash
#!/bin/bash
BACKUP_DIR="/var/www/fleetops/backups"
mkdir -p $BACKUP_DIR
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
FILENAME="$BACKUP_DIR/fleetops_backup_$TIMESTAMP.sql"

# Run pg_dump inside the postgres container
docker exec -t fleetops-postgres pg_dump -U postgres vms_fleetops > $FILENAME

# Keep backups for 30 days only
find $BACKUP_DIR -type f -name "*.sql" -mtime +30 -delete
```

2. Make it executable and add to crontab:

```bash
chmod +x /var/www/fleetops/backup.sh
# Open crontab editor
crontab -e
# Insert line to run every midnight
0 0 * * * /bin/bash /var/www/fleetops/backup.sh
```

---

## 5. Live Logs Verification

Inspect logs of running application modules to verify successful database seeding and server boots:

```bash
# Show Express backend logs
sudo docker compose logs -f backend

# Show Nginx access/error logs
sudo docker compose logs -f nginx
```
