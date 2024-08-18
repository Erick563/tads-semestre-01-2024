const Rest = {

    async get(url) {
        try {
            const response = await fetch(url);

            const data = await response.json();
            if (!response.ok)
                throw new Error(data.message);

            return data;
        } catch (error) {
            throw error;
        }
    },

    async post(url, body) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });
            const data = await response.json();
            return data;
        } catch (error) {
            throw error;
        }
    }
}