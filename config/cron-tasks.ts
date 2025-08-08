export default {
  updateWeeklyMeeting: {
    task: ({ strapi }) => {
      const updateWeeklyMeeting = async (slug: string) => {
        try {
          const { addDays, isPast } = require("date-fns");
          const db = strapi.documents("api::event.event");

          const events = await db.findMany({
            filters: { slug },
          });

          if (!events || events.length !== 1) {
            return;
          }

          const meeting = events[0];
          const currentEventDate = new Date(meeting.date);

          if (isPast(currentEventDate)) {
            const nextOccurrence = addDays(currentEventDate, 7);

            await db.update({
              documentId: meeting.documentId,
              data: {
                date: nextOccurrence,
              },
            });

            await db.publish({ documentId: meeting.documentId, locale: "*" });

            console.log(
              `Updated ${slug} to next occurrence: ${nextOccurrence.toISOString()}`
            );
          }
        } catch (error) {
          console.error("Error in weekly meeting update cron job:", error);
        }
      };

      updateWeeklyMeeting("sunday-fellowship");
      updateWeeklyMeeting("prayer-meeting");
    },
    options: {
      rule: "0 0 * * *",
    },
  },
};
