#! /bin/bash
echo "Starting MongoDB in the Cloud9 environment for unit tests..."
echo "MIT License."
echo "steven velozo <steven@velozo.com>"
echo ""
echo "---"
echo ""
echo "Installing mongodb if it isn't installed..."
sudo apt-get install -y mongodb-org
echo ""
echo "Creating the data folder..."
mkdir data
echo "Launching MongoDB..."
mongod --bind_ip=$IP --dbpath=data --nojournal --rest "$@"