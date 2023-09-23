const Client = require('@microsoft/microsoft-graph-client');

const client = Client.init({
  authProvider: (done) => {
    done(null, process.env.AZURE_CLIENT_ID, process.env.AZURE_CLIENT_SECRET);
  }
});

async function getUserProfile() {
  try {
    const user = await client.api('/me').get();
    return user;
  } catch (error) {
    console.error(error);
  }
}

async function getImportantDates() {
  try {
    const events = await client.api('/me/events').get();
    return events.value; 
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  getUserProfile,
  getImportantDates
};
