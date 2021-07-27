controller:
	node src/commands/mkdir.controller.js $n

middleware:
	node src/commands/mkdir.middleware.js $n

model:
	node src/commands/mkdir.model.js $n

resource:
	node src/commands/mkdir.resource.js $n

route:
	node src/commands/mkdir.route.js $n

validate:
	node src/commands/mkdir.validation.js $n

update_model:
	npm update codian-academy-model

push:
	git add .
	git commit -m $m
	git push

