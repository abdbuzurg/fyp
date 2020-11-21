# Final Year Project

This a final year project that is currently being worked on. Currently, all the files are the backend of our app and it is still in the development stage.

## Installation

If you want to use the app you need to have the following:

1) MySQL Database
2) Redis. If you use the Linux system just use the [link](https://redis.io/download). If you are using other OS systems, you have to install the [docker](https://docs.docker.com/docker-for-windows/install/) and then copy the [image](https://hub.docker.com/_/redis/?_ga=2.65965102.1808228054.1605959639-1411735012.1605287719) of Redis from dockerHub and run it.
3) [NodeJS](https://nodejs.org/en/download/) and NPM. If you install NodeJS, NPM will come with it.
4) Install the dependencies using

```bash
npm install
```

## Usage

Before running the application you have to make the migration for the database:

```bash
npm migration:create
```

After that you can run the application using:


```bash
npm run start2
```

The backend will be running on your system on port 4000. Currently, the development is turned on and the application will run GraphiQL by default and you can see it by going to https://localhost:4000/graphql. On the right of the screen, you will have all the Schema and Types available to work with.


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)