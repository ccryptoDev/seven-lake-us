module.exports = ({ Agent_First,Agent_Last,LeadOwner,firstName,lastname,phoneNo, leadEmail,Description, leadSource,Member,leadSponsor,leadUrl,leadAAM,SourceNotes,LeadNotes }) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style="margin: 0px; padding: 0px">
        <table
          style="width: 100%; border: 0; border-spacing: 0; background: #ffffff"
        >
          <tbody>
            <tr>
              <td style="padding: 0" align="center">
                <table
                  style="
                    width: 90%;
                    border-spacing: 0px 10px;
                    border: 1px solid #000;
                    padding: 30px;
                  "
                >
                <tr>
                  <td style="text-align: center;padding-bottom: 30px;">
                    <img style="width:200px;" src="./logo.png">
                  </td>
                </tr>
    
                <tr>
                  <td>
                    <p style="font-family: Arial, sans-serif;font-size: 16px;line-height: 24px;margin-top:0px;margin-bottom: 16px;color: #000;">Lead Input (from agent in portal)</p>
                     <p style="font-family: Arial, sans-serif;font-size: 16px;line-height: 24px;margin-top:0px;margin-bottom: 16px;color: #000;">Subject: </p>
                  </td>
                </tr>
                 <tr>
                  <td style="padding-bottom:30px;">
                    <table style="border:1px solid #a9a9a9;border-spacing: 0px;width:50%;">
                      <tr>
                        <th style="font-family: Arial, sans-serif;font-size: 16px;line-height: 24px;color: #000;padding: 10px;border-right:1px solid #a9a9a9;border-bottom:1px solid #a9a9a9;">To</th>
                         <th style="font-family: Arial, sans-serif;font-size: 16px;line-height: 24px;color: #000;padding: 10px;border-bottom:1px solid #a9a9a9;">From</th>
                      </tr>
                      <tr>
                        <td style="font-family: Arial, sans-serif;font-size: 16px;line-height: 24px;color: #000;padding: 10px;border-right:1px solid #a9a9a9;">${LeadOwner}</td>
                        <td style="font-family: Arial, sans-serif;font-size: 16px;line-height: 24px;color: #000;padding: 10px;"><span>[FA Portal]</span></td>
                      </tr>
                    </table>
                  </td>
                </tr>
    
    <tr>
      <td>
    
    
    
      <p style="font-family: Arial, sans-serif;font-size: 16px;line-height: 24px;margin-top:0px;margin-bottom: 16px;color: #000;">Dear ${LeadOwner},</p>
    
    <p style="font-family: Arial, sans-serif;font-size: 16px;line-height: 24px;margin-top:0px;margin-bottom: 16px;color: #000;">You have a new lead!!</p>
    
    <p style="font-family: Arial, sans-serif;font-size: 16px;line-height: 24px;margin-top:0px;margin-bottom: 16px;color: #000;"><span>${Agent_First}</span> <span>${Agent_Last}</span> has just referred <span>${firstName}</span> for business funding.</p>
    
    <p style="font-family: Arial, sans-serif;font-size: 16px;line-height: 24px;margin-top:0px;margin-bottom: 16px;color: #000;"><span>${firstName}</span> <span>${lastname}</span></p>
    <p style="font-family: Arial, sans-serif;font-size: 16px;line-height: 24px;margin-top:0px;margin-bottom: 16px;color: #000;"><span>${phoneNo}</span></p>
    <p style="font-family: Arial, sans-serif;font-size: 16px;line-height: 24px;margin-top:0px;margin-bottom: 16px;color: #000;"><span>${leadEmail}</span> </p>
    <p style="font-family: Arial, sans-serif;font-size: 16px;line-height: 24px;margin-top:0px;margin-bottom: 16px;color: #000;"><span>${Description}</span></p>
    
    <p style="font-family: Arial, sans-serif;font-size: 16px;line-height: 24px;margin-top:0px;margin-bottom: 16px;color: #000;">Call them now! </p>
    <p style="font-family: Arial, sans-serif;font-size: 16px;line-height: 24px;margin-top:0px;margin-bottom: 16px;color: #000;"><span>https://www.zoho.com/in/crm/</span></p>
    
    
    
    
    
      </td>
    </tr>
    
    
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
    
    
      `
  }
  