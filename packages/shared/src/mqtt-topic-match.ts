


export function mqttTopicMatch(topic: string, pattern: string) {
    const patternParts = pattern.split("/");
    const topicParts = topic.split("/");

    for (let i = 0; i < patternParts.length; i++) {
        const p = patternParts[i];
        if (p === "#") {
            return true;
        }

        if (p === "+") {
            if (i >= topicParts.length){
                return false;
            }
            continue;
        }

        if (i >= topicParts.length || p !== topicParts[i]) {
            return false;
        }
    }

    return patternParts.length === topicParts.length

}