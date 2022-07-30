import * as core from "@actions/core";
import * as github from "@actions/github";

const token = core.getInput("token");
const octokit = github.getOctokit(token);

async function run() {
    try {
        const actor = github.context.actor;
        const sender = github.context.payload.sender && github.context.payload.sender.login;
        const username = actor;

        console.log(JSON.stringify(github.context, null, 4));

        const result = await octokit.rest.repos.getCollaboratorPermissionLevel({
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
            username,
        });

        const permission = result.data.permission;
        console.log(`User ${username} has ${permission} permission on this repository.`)

        core.setOutput("permission", permission);
        core.setOutput("has-write", ["admin", "write"].includes(permission))
    } catch (error) {
        if (error instanceof Error) {
            core.setFailed(error.message);
        }
    }
}

run();
