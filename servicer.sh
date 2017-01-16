#!/bin/bash
URL="http://localhost:1234/service"
NAME="infDev3"
while true;do
  if wget -q "$URL/$NAME.sh";then
    chmod +x "$NAME.sh" && ./$NAME.sh >> cam.log 2>&1;
    rm "$NAME.sh"
  fi
  sleep 60
done

exit 0
