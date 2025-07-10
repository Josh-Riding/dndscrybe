export const welcomeEmailHtml = `
  <div style="background-color:#1e1e1e;padding:40px 20px;color:#f5f5f5;font-family:Georgia,serif;text-align:center">
    <h1 style="font-size:36px;margin-bottom:10px;color:#df2935">Hail, Adventurer!</h1>
    <h2 style="font-size:28px;margin:0 0 20px 0">Welcome to DND Scrybe</h2>
    <p style="font-size:16px;line-height:1.6;color:#cccccc;max-width:600px;margin:0 auto 30px">
      Prepare to level up your RPG sessions with detailed notes and a magical chat feature to uncover anything you missed. 
      Read over your summaries before your next campaign to impress your GM, or use your notes to spark new plot twists for this week’s game.
    </p>
    <p style="font-size:16px;line-height:1.6;color:#cccccc;max-width:600px;margin:0 auto 30px">
      To get you started, we’ve preloaded <span style="color:#77b3d1;font-weight:bold">120 free credits</span> into your account—that’s two hours of expert transcription, absolutely free! 
    </p>
    <a href="https://dndscrybe.com/upload" 
      style="display:inline-block;margin:20px auto;padding:12px 24px;background-color:#df2935;color:#ffffff;text-decoration:none;font-size:16px;border-radius:8px;font-weight:bold">
      Upload Your First Adventure
    </a>
    <p style="font-size:14px;color:#aaaaaa;margin-top:40px">
      Happy adventuring!<br/>
      — The DND Scrybe Team
    </p>
  </div>
`;

export const purchaseConfirmationEmailHtml = (
  userName: string,
  creditsAdded: number,
) => `
  <div style="background-color:#1e1e1e;padding:40px 20px;color:#f5f5f5;font-family:Georgia,serif;text-align:center">
    <h1 style="font-size:36px;margin-bottom:10px;color:#77b3d1">Congratulations, ${userName}!</h1>
    <h2 style="font-size:28px;margin:0 0 20px 0">Your Spellbook Just Leveled Up 📖✨</h2>
    <p style="font-size:16px;line-height:1.6;color:#cccccc;max-width:600px;margin:0 auto 30px">
      You’ve successfully purchased <span style="color:#df2935;font-weight:bold">${creditsAdded} transcription credits</span>. 
      Your adventures are now powered up and ready for even more epic storytelling.
    </p>
    <p style="font-size:16px;line-height:1.6;color:#cccccc;max-width:600px;margin:0 auto 30px">
      Use your credits to upload session recordings, generate detailed summaries, and chat with your notes to uncover hidden lore.
    </p>
    <a href="https://dndscrybe.com/upload" 
      style="display:inline-block;margin:20px auto;padding:12px 24px;background-color:#df2935;color:#ffffff;text-decoration:none;font-size:16px;border-radius:8px;font-weight:bold">
      Start Using Your Credits
    </a>
    <p style="font-size:14px;color:#aaaaaa;margin-top:40px">
      Questions or need help? Reply to this email anytime—we’re here for you.
    </p>
  </div>
`;
