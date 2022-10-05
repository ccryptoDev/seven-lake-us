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
                <p style="font-family: Arial, sans-serif;font-size: 16px;line-height: 24px;margin-top:0px;margin-bottom: 16px;color: #000;">Agent Sign Up (from ${Website})</p>
                 <p style="font-family: Arial, sans-serif;font-size: 16px;line-height: 24px;margin-top:0px;margin-bottom: 16px;color: #000;">Subject: <span></span></p>
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
                    <td style="font-family: Arial, sans-serif;font-size: 16px;line-height: 24px;color: #000;padding: 10px;border-right:1px solid #a9a9a9;">Potential Agent</td>
                    <td style="font-family: Arial, sans-serif;font-size: 16px;line-height: 24px;color: #000;padding: 10px;"><span>${Office}</span></td>
                  </tr>
                </table>
              </td>
            </tr>



            <tr>
              <td>


             <p style="font-family: Arial, sans-serif;font-size: 16px;line-height: 24px;margin-top:0px;margin-bottom: 16px;color: #000;">    Hi, <span>${firstName}</span></p>
 

 
 <p style="font-family: Arial, sans-serif;font-size: 16px;line-height: 24px;margin-top:0px;margin-bottom: 16px;color: #000;">So you want to earn more money helping people get money to start and grow their business? Confirm your email to get started. By clicking you are confirming your email address and agreeing to our <span>[Terms of Service]</span></p>
 

 
 <p style="font-family: Arial, sans-serif;font-size: 16px;line-height: 24px;margin-top:0px;margin-bottom: 16px;color: #000;">You can then log in to your account and get started!</p>
 




              </td>
            </tr>


            <tr>
              <td style="box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;padding: 30px;">
                <h3 style="font-family: Arial, sans-serif;font-size: 30px;line-height: 24px;margin-top:0px;margin-bottom: 16px;color: #000;;font-weight: 500;">XYZ</h3>

                <hr>

                <h5 style="font-family: Arial, sans-serif;font-size: 20px;line-height: 24px;margin-top:0px;margin-bottom: 16px;color: #000;">Almost there!</h5>
                 <h5 style="font-family: Arial, sans-serif;font-size: 20px;line-height: 24px;margin-top:0px;margin-bottom: 16px;color: #000;">Let's confirm your email address.</h5>
                 <p style="font-family: Arial, sans-serif;font-size: 16px;line-height: 24px;margin:0px;color: #000;">By clicking on the link, you are confirming your email address and agreeing to Another story's terms of service.</p>
                 <button href="google.com" type="" style="padding: 0px 20px;height: 45px;background: #139ec7;font-family: Arial, sans-serif;border-radius: 100px;font-weight: 600;font-size: 14px;line-height: 21px;color: #fff;border: 1px solid #139ec7;margin: 30px auto;display: block;" ><a href=${uniqueString} style="text-decoration: none; color: white;">Confirm Email</a></button>

                 <p style="text-align:center;font-family: Arial, sans-serif;font-size: 16px;line-height: 24px;margin-top:0px;margin-bottom: 10px;color: #000;">This email was send by: Another Story, Unit F1, 23-27 Arcola Street, London , E8 2DJ</p>
                 <p style="text-align:center;font-family: Arial, sans-serif;font-size: 16px;line-height: 24px;margin:0px;color: #000;">To Unsubscripe click : <a href="#">here</a></p>
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
  