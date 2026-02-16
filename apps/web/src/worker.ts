import { Worker, Queue } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis(process.env.REDIS_URL || "redis://localhost:6379", {
  maxRetriesPerRequest: null,
});

// Queues
export const publishQueue = new Queue("publish-post", { connection });
export const replyQueue = new Queue("process-reply", { connection });
export const reminderQueue = new Queue("send-reminder", { connection });

// Post publishing worker
const publishWorker = new Worker(
  "publish-post",
  async (job) => {
    const { postId } = job.data;
    console.log(`Publishing post: ${postId}`);

    // In production:
    // 1. Fetch post from DB
    // 2. Fetch agent's social account credentials
    // 3. Call SocialPublisher skill
    // 4. Update post status in DB
    // 5. Handle errors and retries
  },
  {
    connection,
    concurrency: 5,
    limiter: {
      max: 10,
      duration: 60000, // 10 posts per minute max
    },
  }
);

// Reply processing worker
const replyWorker = new Worker(
  "process-reply",
  async (job) => {
    const { replyId, platform, body, authorName, postId } = job.data;
    console.log(`Processing reply ${replyId} from ${authorName} on ${platform}`);

    // In production:
    // 1. Classify intent using ReplyMonitor skill
    // 2. Auto-respond if appropriate
    // 3. Update lead score
    // 4. Notify agent if escalation needed
  },
  { connection, concurrency: 10 }
);

// Reminder worker
const reminderWorker = new Worker(
  "send-reminder",
  async (job) => {
    const { appointmentId, type } = job.data;
    console.log(`Sending ${type} reminder for appointment: ${appointmentId}`);

    // In production:
    // 1. Fetch appointment details
    // 2. Send reminder via email/SMS to both agent and lead
  },
  { connection, concurrency: 5 }
);

// Error handlers
publishWorker.on("failed", (job, err) => {
  console.error(`Post publish failed: ${job?.id}`, err);
});

replyWorker.on("failed", (job, err) => {
  console.error(`Reply processing failed: ${job?.id}`, err);
});

reminderWorker.on("failed", (job, err) => {
  console.error(`Reminder failed: ${job?.id}`, err);
});

console.log("Workers started: publish-post, process-reply, send-reminder");
