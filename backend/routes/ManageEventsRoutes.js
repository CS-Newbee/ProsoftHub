import express from "express";
import {
  createEvent,
  getEventsByAdvisor,
  updateEvent,
  deleteEvent,
  postponeEvent,
  registerEvent   // ✅ import the correct function
} from "../controllers/ManageEventsController.js";

const router = express.Router();

// CREATE event
router.post("/", createEvent);

// GET events by advisor
router.get("/advisor/:advisor_id", getEventsByAdvisor);

// UPDATE event
router.put("/:id", updateEvent);

// DELETE event
router.delete("/:id", deleteEvent);

// POSTPONE event
router.put("/:id/postpone", postponeEvent);

// REGISTER member for event
router.post("/register/:event_id", registerEvent);  // ✅ use correct function name

export default router;
