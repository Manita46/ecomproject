const moment = require("moment-timezone");
const { prisma } = require("./utils");

// สร้างเลข Job DO + YYYYMMDD + Running 3
async function generateJobCode() {
  const today = moment().tz("Asia/Bangkok").format("YYYYMMDD");
  const prefix = `DO${today}`;

  const lastJob = await prisma.job.findFirst({
    where: {
      jobCode: { startsWith: prefix }
    },
    orderBy: {
      jobCode: "desc"
    }
  });

  let running = 1;

  if (lastJob?.jobCode) {
    const lastRun = parseInt(lastJob.jobCode.slice(-3), 10);
    running = lastRun + 1;
  }

  const runningStr = String(running).padStart(3, "0");

  return `${prefix}${runningStr}`;
}

module.exports = { generateJobCode };
