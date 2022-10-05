module.exports = ({ firstName, lastName, phone, email,Website,Office, uniqueString }) => {
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
                width: 100%;
                border-spacing: 0px 10px;
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
                <p style="font-family: Arial, sans-serif;font-size: 16px;line-height: 24px;margin-top:0px;margin-bottom: 16px;color: #000;">Agent Welcome (after confirmed email)</p>
                 <p style="font-family: Arial, sans-serif;font-size: 16px;line-height: 24px;margin-top:0px;margin-bottom: 16px;color: #000;">Subject: <span>[Member Office]</span> Get Started </p>
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
                    <td style="font-family: Arial, sans-serif;font-size: 16px;line-height: 24px;color: #000;padding: 10px;border-right:1px solid #a9a9a9;">New Agent</td>
                    <td style="font-family: Arial, sans-serif;font-size: 16px;line-height: 24px;color: #000;padding: 10px;"><span>[Member Office]</span></td>
                  </tr>
                </table>
              </td>
            </tr>



            <tr>
              <td>


             <p style="font-family: Arial, sans-serif;font-size: 16px;line-height: 24px;margin-top:0px;margin-bottom: 16px;color: #000;">    Hi, <span>[Agent First Name]</span></p>
 

 
 <p style="font-family: Arial, sans-serif;font-size: 16px;line-height: 24px;margin-top:0px;margin-bottom: 16px;color: #000;">
  <span>[Member Office]</span> is ready to help you get started helping small business owners get funding. We have multiple funding programs to help almost everyone, from startups to existing businesses. 
 </p>
 

<ul>
<li style="font-family: Arial, sans-serif;font-size: 16px;line-height: 24px;margin-top:0px;margin-bottom: 10px;color: #000;">	SBA</li>
<li style="font-family: Arial, sans-serif;font-size: 16px;line-height: 24px;margin-top:0px;margin-bottom: 10px;color: #000;">	Equipment</li>
<li style="font-family: Arial, sans-serif;font-size: 16px;line-height: 24px;margin-top:0px;margin-bottom: 10px;color: #000;">	Revenue Advance</li>
<li style="font-family: Arial, sans-serif;font-size: 16px;line-height: 24px;margin-top:0px;margin-bottom: 10px;color: #000;">	Line of Credit</li>
<li style="font-family: Arial, sans-serif;font-size: 16px;line-height: 24px;margin-top:0px;margin-bottom: 10px;color: #000;">	Real Estate</li>
<li style="font-family: Arial, sans-serif;font-size: 16px;line-height: 24px;margin-top:0px;margin-bottom: 10px;color: #000;">Unsecured Credit</li>
<li style="font-family: Arial, sans-serif;font-size: 16px;line-height: 24px;margin-top:0px;margin-bottom: 10px;color: #000;">Retirement Rollover</li>

</ul>


 <p style="font-family: Arial, sans-serif;font-size: 16px;line-height: 24px;margin-top:0px;margin-bottom: 16px;color: #000;">
<span>[Agent Owner]</span> will be your primary contact and can answer any questions. Please call <span>[Member Office]</span> at <span>[Phone]</span> to go over any leads or funding questions you have. </p>


 <p style="font-family: Arial, sans-serif;font-size: 16px;line-height: 24px;margin-top:0px;margin-bottom: 16px;color: #000;">
  <span>[Log In]</span>
</p>
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
  