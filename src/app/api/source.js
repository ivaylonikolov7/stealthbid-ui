const url = "https://nanoshutter.staging.shutter.network/decrypt/with_time/";
const timestamp = args[0];
let responses = [];
for (let i = 1; i < args.length; i++) {
  const encryptedMessage = args[i];

  const request = Functions.makeHttpRequest({
    url: url,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      encrypted_msg: `${encryptedMessage}`,
      timestamp: Number(timestamp),
    },
  });

  const response = await request;
  if (response.error) {
    console.error(response.error);
    let test = JSON.stringify(encryptedMessage);
    let err = JSON.stringify(response);
    throw Error(`Request failed ${err}, ${test}`);
  }

  let amount = Number(response.data["message"]);
  if (!amount) throw Error("The encypted message is not a number");
  responses.push(amount);
}

// Use JSON.stringify() to convert from JSON object to JSON string
// Finally, use the helper Functions.encodeString() to encode from string to bytes
return Functions.encodeString(JSON.stringify(responses));
