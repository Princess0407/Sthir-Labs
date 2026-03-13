#!/bin/bash
set -e

# Sthir Labs Sovereign Vault Deployment & Testing Script
# This script automates deploying the chaincode to a local NBFLite peer
# and running a test transaction using the mock AI data in the middleware.

CHANNEL_NAME="sovereign-channel"
CC_NAME="sovereignvault"
CC_SRC_PATH="../chaincode"
CC_VERSION="1.0"

echo "======================================================="
echo " Deploying Sovereign Vault Chaincode to Local NBFLite "
echo "======================================================="

if ! command -v peer &> /dev/null
then
    echo "Warning: 'peer' command could not be found. Assuming mock environment."
    echo "Mocking deployment steps for NBFLite (Hyperledger Fabric)..."
    sleep 1
    echo "> Packaging chaincode..."
    sleep 1
    echo "> Installing chaincode..."
    sleep 1
    echo "> Approving chaincode definition..."
    sleep 1
    echo "> Committing chaincode definition to channel: $CHANNEL_NAME"
    sleep 1
    echo "[Success] Mock deployment complete."
else
    # Actual Fabric deployment commands
    echo "Packaging chaincode..."
    peer lifecycle chaincode package ${CC_NAME}.tar.gz --path ${CC_SRC_PATH} --lang golang --label ${CC_NAME}_${CC_VERSION}

    echo "Installing chaincode..."
    peer lifecycle chaincode install ${CC_NAME}.tar.gz

    # Extract Package ID
    export CC_PACKAGE_ID=$(peer lifecycle chaincode queryinstalled | grep ${CC_NAME}_${CC_VERSION} | awk '{print $3}' | sed 's/,//')

    echo "Approving for organization..."
    peer lifecycle chaincode approveformyorg -o localhost:7050 --channelID $CHANNEL_NAME --name ${CC_NAME} --version ${CC_VERSION} --package-id $CC_PACKAGE_ID --sequence 1 --tls

    echo "Committing chaincode..."
    peer lifecycle chaincode commit -o localhost:7050 --channelID $CHANNEL_NAME --name ${CC_NAME} --version ${CC_VERSION} --sequence 1 --tls
fi

echo ""
echo "======================================================="
echo " Running Local Test Transaction via Integration Bridge "
echo "======================================================="

# Run the Node.js middleware to mock AI test pipeline
cd ../middleware
if ! command -v node &> /dev/null
then
    echo "Error: Node.js is not installed. Please install Node.js to run the middleware."
    exit 1
fi

npm install --silent > /dev/null 2>&1 || true
node index.js

echo ""
echo "Deployment and testing automation finished."
