
if [[ -z $1 ] ]; then
  cd backend
  npm run start
  else
  cd backend
  npm run start &
  cd ..
  cd frontend
  npm run start

fi

