interface RequestPropertyData {
  name: string;
  email: string;
  phone: string;
  propertyType: string;
  propertyPurpose: string;
  budgetMin: string;
  budgetMax: string;
  area: string;
  location: string;
  description: string;
}

export function requestPropertyEmailTemplate(data: RequestPropertyData) {
  const {
    name,
    email,
    phone,
    propertyType,
    propertyPurpose,
    budgetMin,
    budgetMax,
    area,
    location,
    description,
  } = data;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Property Request</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #3b82f6, #10b981);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          background: #f9fafb;
          padding: 30px;
          border-radius: 0 0 10px 10px;
        }
        .field {
          margin-bottom: 20px;
        }
        .field-label {
          font-weight: bold;
          color: #374151;
          margin-bottom: 5px;
        }
        .field-value {
          background: white;
          padding: 12px;
          border-radius: 6px;
          border-left: 4px solid #3b82f6;
        }
        .description-box {
          background: white;
          padding: 15px;
          border-radius: 6px;
          border-left: 4px solid #10b981;
          margin-top: 10px;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          color: #6b7280;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🏠 New Property Request</h1>
        <p>A new property request has been submitted</p>
      </div>
      
      <div class="content">
        <h2>Request Details</h2>
        
        <div class="field">
          <div class="field-label">👤 Contact Information</div>
          <div class="field-value">
            <strong>Name:</strong> ${name}<br>
            <strong>Email:</strong> ${email}<br>
            <strong>Phone:</strong> ${phone}
          </div>
        </div>
        
        <div class="field">
          <div class="field-label">🏢 Property Requirements</div>
          <div class="field-value">
            <strong>Property Type:</strong> ${
              propertyType || "Not specified"
            }<br>
            <strong>Property Purpose:</strong> ${
              propertyPurpose
                ? propertyPurpose.charAt(0).toUpperCase() +
                  propertyPurpose.slice(1)
                : "Not specified"
            }<br>
            <strong>Budget Range:</strong> ${
              budgetMin && budgetMax
                ? `${budgetMin} - ${budgetMax}`
                : budgetMin || budgetMax || "Not specified"
            }<br>
            <strong>Preferred Area:</strong> ${
              area ? `${area} sqm` : "Not specified"
            }<br>
            <strong>Preferred Location:</strong> ${location || "Not specified"}
          </div>
        </div>
        
        <div class="field">
          <div class="field-label">📝 Detailed Requirements</div>
          <div class="description-box">
            ${description || "No detailed requirements provided"}
          </div>
        </div>
        
        <div class="field">
          <div class="field-label">📅 Submission Time</div>
          <div class="field-value">
            ${new Date().toLocaleString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      </div>
      
      <div class="footer">
        <p>This request was submitted through the Addis Broker platform.</p>
        <p>Please respond to the user's email to follow up on this request.</p>
      </div>
    </body>
    </html>
  `;
}

