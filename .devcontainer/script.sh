sudo apt-get install gnupg curl
curl -fsSL https://pgp.mongodb.com/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg \
   --dearmor
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo mkdir -p /data/db
echo "START MONGODB"
sudo mongod --replSet local00 &
sudo sleep 5
echo "INIT REPLICA"
sudo mongosh --eval "rs.initiate();"
sudo sleep 5
echo "RESTORE"
sudo mongorestore --gzip -d demo src/main/resources/dumps/