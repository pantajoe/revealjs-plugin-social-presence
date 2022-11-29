module.exports = {
  client: {
    includes: ['./src/**/*.{graphql,gql}'],
    exludes: ['**/__generated__/**/*', '**/node_modules'],
    service: {
      name: 'social-presence-backend',
      localSchemaFile: './backend/schema.gql',
    },
  },
}
