import * as core from '@actions/core';
import * as github from '@actions/github';
import { context, GitHub } from '@actions/github/lib/utils';

let _octokit;
function getOctokit(): InstanceType<typeof GitHub> {
    if (_octokit != null) {
        return _octokit;
    }
    const token = process.env.GITHUB_TOKEN;
    if (token == null) {
        throw {message: "'GITHUB_TOKEN' not set"};
    }
    _octokit = github.getOctokit(token);
    return _octokit;
}

async function getLatestTag() {
    const tags = await getOctokit().repos.listTags({
        ...context.repo,
        per_page: 100,
    });
    
    // if (tags.data.length == 0) {
    //     throw {message: "Coundnt fetch tags"}
    // }
    return tags.data[0].name;    
}

async function getCommits() {
    let baseRef = core.getInput('baseRef');
    if (baseRef == null) {
        baseRef = await getLatestTag();
    }
    const headRef = core.getInput('headRef');

    const commits = await getOctokit().repos.compareCommits({
        ...context.repo,
        base: baseRef,
        head: headRef,
    });

    return commits.data.commits;
}

export default async function main() {
    try {
        const commits = await getCommits();
        const changelog = commits
            .map((commit) => commit.commit.message)
            .join("\n");
        
        core.setOutput("log", changelog)
    } catch (error) {
        core.setFailed(error.message);
    }
}
