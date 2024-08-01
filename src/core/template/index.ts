import ejs from "ejs";
import path from "path";

const EmailTemplate = {
  Reminder: async (
    amount: number,
    user: string,
    date: string,
    code: string
  ) => {
    try {
      const html = await ejs.renderFile(path.join(__dirname, "invoice.ejs"), {
        amount,
        user,
        date,
        code
      });
      return html;
    } catch (error) {
      console.error("Error rendering Reminder template:", error);
      return "";
    }
  },
};

export default EmailTemplate;