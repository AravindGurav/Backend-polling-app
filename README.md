# polling-app-backend
you can add entries and update the entries( or update the count of the particular vote) and delete the entry with the id 
API Endpoints: 
1. get the polls from mongoDb: https://backend-polling-app.vercel.app/polls
2. update the count of entries by post: https://backend-polling-app.vercel.app/polls/:id/vote
3. delete an entry: https://backend-polling-app.vercel.app/polls/:id



Schema: 
  {
    question: {
      type: String,
      required: true,
    },
    options: [
      {
        text: { type: String, required: true },
        votes: { type: Number, default: 0 },
      },
    ],
  },
  {
    timestamps: true,
  }


