from astrapy import DataAPIClient
import os
from dotenv import load_dotenv

load_dotenv()


# Initialize the client
def initialize_client():
    try:
        token = os.getenv("ASTRA_DB_TOKEN")
        endpoint = os.getenv("ASTRA_DB_ENDPOINT")

        if not token or not endpoint:
            raise ValueError(
                "AstraDB token or endpoint not found in environment variables."
            )

        client = DataAPIClient(token)
        # print("CLient - ", client)
        db = client.get_database_by_api_endpoint(endpoint)
        return db
    except Exception as e:
        print(f"Error initializing AstraDB client: {e}")
        return None


def fetch_collection_data(db, collection_name):
    try:
        collection = db[collection_name]
        documents = collection.find({})
        return list(documents)
    except Exception as e:
        print(f"Error fetching data from collection {collection_name}: {e}")
        return None
