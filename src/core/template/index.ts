// File: src/core/template/index.ts

import ejs from "ejs";
import path from "path";

const EmailTemplate = {
  Reminder: async (
    userName: string,
    bookTitle: string,
    returnDate: string
  ) => {
    try {
      const html = await ejs.renderFile(path.join(__dirname, "reminder.ejs"), {
        userName,
        bookTitle,
        returnDate
      });
      return html;
    } catch (error) {
      console.error("Error rendering Reminder template:", error);
      return "";
    }
  },
  BookAvailable: async (
    userName: string,
    bookTitle: string
  ) => {
    try {
      const html = await ejs.renderFile(path.join(__dirname, "bookAvailable.ejs"), {
        userName,
        bookTitle
      });
      return html;
    } catch (error) {
      console.error("Error rendering Book Available template:", error);
      return "";
    }
  },
};

export default EmailTemplate;