const graphql = require("graphql");
const _ = require("lodash");

const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLSchema,
	GraphQLID,
	GraphQLInt,
	GraphQLList,
} = graphql;

// Dummy data
let books = [
	{ name: "Game of Trones", genre: "Fantasy", id: "1", authorId: "1" },
	{ name: "The Lord of The Rings", genre: "Fantasy", id: "2", authorId: "2" },
	{
		name: "Journey to The Centre of The Earth",
		genre: "Sci-Fi",
		id: "3",
		authorId: "3",
	},
	{
		name: "The Hobbit",
		genre: "Fantasy",
		id: "4",
		authorId: "2",
	},
	{
		name: "Twenty Thousand Leagues Under The Sea",
		genre: "Sci-Fi",
		id: "5",
		authorId: "3",
	},
	{
		name: "Around The World In 80 Days",
		genre: "Adventure",
		id: "6",
		authorId: "3",
	},
];

let authors = [
	{ name: "George R. R. Martin", age: 70, id: "1" },
	{ name: "J. R. R. Tolkien", age: 89, id: "2" },
	{ name: "Jules Verne", age: 66, id: "3" },
];

const BookType = new GraphQLObjectType({
	name: "Book",
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		genre: { type: GraphQLString },
		author: {
			type: AuthorType,
			resolve(parent, args) {
				return _.find(authors, { id: parent.authorId });
			},
		},
	}),
});

const AuthorType = new GraphQLObjectType({
	name: "Author",
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		age: { type: GraphQLInt },
		books: {
			type: new GraphQLList(BookType),
			resolve(parent, args) {
				return _.filter(books, { authorId: parent.id });
			},
		},
	}),
});

const RootQuery = new GraphQLObjectType({
	name: "RootQueryType",
	fields: {
		book: {
			type: BookType,
			args: { id: { type: GraphQLID } },
			resolve(parent, args) {
				return _.find(books, { id: args.id });
			},
		},
		author: {
			type: AuthorType,
			args: { id: { type: GraphQLID } },
			resolve(parent, args) {
				return _.find(authors, { id: args.id });
			},
		},
		books: {
			type: new GraphQLList(BookType),
			resolve(parent, args) {
				return books;
			},
		},
		authors: {
			type: new GraphQLList(AuthorType),
			resolve(parent, args) {
				return authors;
			},
		},
	},
});

module.exports = new GraphQLSchema({
	query: RootQuery,
});
