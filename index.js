const express = require("express")
const app = express()
app.use(express.json())

const cors = require("cors")
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
}
app.use(cors(corsOptions))

// Connect to Database
const { initializeDatabase } = require("./db/db.connect")
initializeDatabase()

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

app.get("/", (req, res) => {
  res.send("Hello express server")
})

// Import Poll Model
const Poll = require("./models/poll.models")

// Function to create a poll
async function createPoll(newPoll) {
  try {
    const poll = new Poll(newPoll)
    const savedPoll = await poll.save()
    return savedPoll
  } catch (error) {
    console.log("Error in creating poll", error)
  }
}

app.post("/polls", async (req, res) => {
  try {
    const savedPoll = await createPoll(req.body)
    if (savedPoll) {
      res.status(201).json({
        message: "Poll created successfully",
        poll: savedPoll,
      })
    } else {
      res.status(400).json({ error: "Invalid poll data" })
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to create poll" })
  }
})

// Function to fetch all polls
async function getAllPolls() {
  try {
    const polls = await Poll.find()
    return polls
  } catch (error) {
    console.log(error)
  }
}

app.get("/polls", async (req, res) => {
  try {
    const polls = await getAllPolls()
    if (polls.length > 0) {
      res.json(polls)
    } else {
      res.status(404).json({ error: "No polls found" })
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch polls" })
  }
})

// Function to vote on a poll
async function votePoll(pollId, optionIndex) {
  try {
    const poll = await Poll.findById(pollId)
    if (!poll) return null

    poll.options[optionIndex].votes += 1
    await poll.save()
    return poll
  } catch (error) {
    console.log(error)
  }
}

app.post("/polls/:id/vote", async (req, res) => {
  try {
    const updatedPoll = await votePoll(req.params.id, req.body.optionIndex)
    if (updatedPoll) {
      res.json({ message: "Vote recorded", poll: updatedPoll })
    } else {
      res.status(404).json({ error: "Poll not found" })
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to vote on poll" })
  }
})



//deleting the polls
// Function to delete all polls
async function deleteAllPolls() {
  try {
    const result = await Poll.deleteMany({})
    return result
  } catch (error) {
    console.log(error)
  }
}

app.delete("/polls", async (req, res) => {
  try {
    const result = await deleteAllPolls()
    res.json({ message: "All polls deleted", result })
  } catch (error) {
    res.status(500).json({ error: "Failed to delete polls" })
  }
})

// Function to delete a poll by ID
async function deletePollById(pollId) {
  try {
    const poll = await Poll.findByIdAndDelete(pollId)
    return poll
  } catch (error) {
    console.log(error)
  }
}

app.delete("/polls/:id", async (req, res) => {
  try {
    const deletedPoll = await deletePollById(req.params.id)
    if (deletedPoll) {
      res.json({ message: "Poll deleted successfully", poll: deletedPoll })
    } else {
      res.status(404).json({ error: "Poll not found" })
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete poll" })
  }
})
