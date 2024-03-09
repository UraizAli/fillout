const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON request body
app.use(express.json());



function filterResponses(responses, filters) {
    return responses.filter(response => {
        return filters.every(filter => {
            const question = response.questions.find(q => q.id === filter.id);
            if (!question) return false;

            switch (filter.condition) {
                case 'equals':
                    return question.value === filter.value;
                case 'does_not_equal':
                    return question.value !== filter.value;
                case 'greater_than':
                    return question.value > filter.value;
                case 'less_than':
                    return question.value < filter.value;
                default:
                    return false;
            }
        });
    });
}


// Endpoint to fetch filtered responses
app.get('/:formId/filteredResponses', async (req, res) => {
    try {
        const formId = req.params.formId;
        const apiKey = 'sk_prod_TfMbARhdgues5AuIosvvdAC9WsA5kXiZlW8HZPaRDlIbCpSpLsXBeZO7dCVZQwHAY3P4VSBPiiC33poZ1tdUj2ljOzdTCCOSpUZ_3912';

        const apiUrl = 'https://api.fillout.com';
        const endpoint = `/v1/api/forms/${formId}/submissions`;

        const queryParams = { ...req.query };
        const filters = queryParams.filters ? JSON.parse(queryParams.filters) : [];
        delete queryParams.filters;

        const config = {
            headers: {
                'Authorization': `Bearer ${apiKey}`
            },
            params: queryParams
        };

        const response = await axios.get(apiUrl + endpoint, config);
        const result = response.data['responses']


        filteredResult = filterResponses(result, filters)
        res.json(filteredResult);
    } catch (error) {
        console.error('Error fetching filtered responses:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
