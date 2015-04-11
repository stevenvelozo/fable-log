#! /bin/bash
echo "Wait for MongoDB to spool up on Travis"
echo "Contact: Steven Velozo <steven@paviasystems.com>"
echo ""
echo "---"
echo ""

echo "  > Waiting 10 seconds for the test container to initialize (so mongodb tests don't fail anymore)"
ContainerStartupWait=0
while [[ $ContainerStartupWait -lt 10 ]]; do
    echo "$ContainerStartupWait banana"
    ((++ContainerStartupWait))
    sleep 1
done
