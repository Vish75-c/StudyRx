import PDFDocument from "pdfkit"
const exportChatAsPDF = (chat, res) => {
  const doc = new PDFDocument({ margin: 50 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=chat-${chat._id}.pdf`
  );

  doc.pipe(res);

  // Title
  doc.fontSize(20).font("Helvetica-Bold").text("MediQuery Chat Export", {
    align: "center",
  });
  doc.moveDown();

  // Chat title
  doc.fontSize(14).font("Helvetica").text(`Chat: ${chat.title}`);
  doc.fontSize(10).text(`Date: ${new Date(chat.createdAt).toLocaleString()}`);
  doc.moveDown();
  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown();

  // Messages
  chat.messages.forEach((msg) => {
    const isUser = msg.role === "user";

    doc
      .fontSize(11)
      .font("Helvetica-Bold")
      .fillColor(isUser ? "#1a56db" : "#057a55")
      .text(isUser ? "You:" : "MediQuery AI:");

    doc
      .fontSize(11)
      .font("Helvetica")
      .fillColor("#111827")
      .text(msg.content, { indent: 10 });

    // Sources
    if (msg.sources && msg.sources.length > 0) {
      doc.moveDown(0.3);
      doc.fontSize(9).fillColor("#6b7280").text("Sources:", { indent: 10 });
      msg.sources.forEach((src) => {
        doc
          .fontSize(9)
          .fillColor("#6b7280")
          .text(`• ${src.source} ${src.page !== "N/A" ? `— Page ${src.page}` : ""}`, {
            indent: 20,
          });
      });
    }

    doc.moveDown();
  });

  // Disclaimer
  doc.moveDown();
  doc
    .fontSize(9)
    .fillColor("#9ca3af")
    .text(
      "Disclaimer: This content is for informational purposes only. Always consult a licensed medical professional.",
      { align: "center" }
    );

  doc.end();
};

export default exportChatAsPDF;