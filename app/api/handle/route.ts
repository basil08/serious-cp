import { NextRequest } from "next/server";
import { createHash } from "crypto";
async function callCFEndpoint(methodName: String, params: any) {
    /**
     * Makes a request to the Codeforces API.
     * @param {string} methodName - The API method name.
     * @param {Object} params - An object containing the parameters for the API request.
     */
    const apiKey = process.env.CF_API_KEY;
    const time = Math.floor(Date.now() / 1000);
    params.apiKey = apiKey;
    params.time = time;

    // Generate random 6 characters for apiSig
    const rand = Math.random().toString(36).substring(2, 8);

    // Sort parameters lexicographically
    const sortedParams = Object.keys(params).sort().map(param => `${param}=${params[param]}`).join('&');

    // Create the string to hash
    const stringToHash = `${rand}/${methodName}?${sortedParams}#${process.env.CF_API_SECRET}`;

    // Compute the SHA-512 hash
    const hash = createHash('sha512').update(stringToHash).digest('hex');

    // Construct apiSig
    const apiSig = `${rand}${hash}`;

    // Construct the final URL
    const url = `https://codeforces.com/api/${methodName}?${sortedParams}&apiSig=${apiSig}`;

    try {
        const response = await fetch(url, {
            method: 'GET'
        });
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error making request to Codeforces API:', error);
    }
}
export async function GET(req: NextRequest) {
   
    const searchParams = req.nextUrl.searchParams;
    const userInput = searchParams.get('userInput');

    console.log("userinput", userInput);

    const res = await callCFEndpoint('user.info', {handles: userInput });

    if (res) {
        return Response.json(res, {status: 200})
    } else {
        return Response.json(null, {status: 501});
    }
}