# nodejs-shopping-app

This repo is meant for setting up a shopping-app in node.

### Download and install for your platform

1. **Node.js and npm**: [Node.js Download](https://nodejs.org/en/download/)
2. **Git**: [Git SCM Download](https://git-scm.com/downloads)
3. **PostgreSQL**: [PostgreSQL Download](https://www.postgresql.org/download/)

## Running the app

1. Create Database: Open `pgAdmin` and create a Database called `shopping_db`. Refer [How To Create A Postgres Database Using pgAdmin](https://youtu.be/1wvDVBjNDys?t=3m37s)
2. Generate ssh keys: [Generate SSH keys for Git authorization](http://inchoo.net/dev-talk/how-to-generate-ssh-keys-for-git-authorization/)
3. Clone the project:

```bash
git clone https://github.com/chahatjain2002/shopping-app.git`.
```

4. Go inside directory:

```bash
cd shopping-app
```

5. Database Connection: Update the `.env` file to match your database connection details.
6. Write your JWT_SECRET_KEY to generate a jwt token.
7. Add your own google client id and google secret key provided by google
8. Build the Project:

```bash
npm install
```

9. Run the app

```bash
# Development mode
$ nodemon app.js

```

## Stay in touch

- Author - Chahat Jain
