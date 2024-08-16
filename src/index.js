// src/index.js
import api, { route } from '@forge/api';

export async function handleIssueEvent(event) {
    try {
        const issueKey = event.issue.key;
        console.log(`Received event for issue: ${issueKey}`);
        console.log(`Issue ${issueKey} received successfully.`);
    } catch (error) {
        console.error('Error handling issue event:', error);
    }
}

export async function handleUpdateIssueRequest(req) {
    try {
        const { issueKey, newSummary } = JSON.parse(req.body);
        if (!issueKey || !newSummary) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing issueKey or newSummary in request body' })
            };
        }
        // Call the updateIssueSummary function
        await updateIssueSummaryAsUser(issueKey, newSummary);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: `Issue ${issueKey} updated successfully.` })
        };
    } catch (error) {
        console.error('Error processing request:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
}




async function updateIssueSummary(issueKey, newSummary) {
    const response = await api.asApp().requestJira(route`/rest/api/3/issue/${issueKey}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            fields: {
                summary: newSummary
            }
        })
    });

    if (!response.ok) {
        throw new Error(`Failed to update issue: ${response.statusText}`);
    }
}

async function updateIssueSummaryAsUser(issueKey, newSummary) {
    const response = await api.asUser().requestJira(route`/rest/api/3/issue/${issueKey}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            fields: {
                summary: newSummary
            }
        })
    });

    if (!response.ok) {
        throw new Error(`Failed to update issue: ${response.statusText}`);
    }
}