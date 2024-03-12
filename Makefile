run:
	cd app && nvm use 21.6.2 && npm start	

server:
	. env/bin/activate && cd api && python manage.py runserver

redis:	
	redis-server