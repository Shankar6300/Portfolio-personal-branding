#include <bits/stdc++.h>
using namespace std;

struct Book {
    int id;
    string title;
    string author;
    bool isIssued;
};

stack<Book> recentIssued;

class Library {
private:
    vector<Book> books;  
    string filename = "library_data.txt";  

public:
    Library() {
        loadFromFile(); 
    }

    ~Library() {
        saveToFile();   
    }

    
    void addBook() {
        Book newBook;
        cout << "\nEnter Book ID: ";
        cin >> newBook.id;
        cin.ignore();
        cout << "Enter Book Title: ";
        getline(cin, newBook.title);
        cout << "Enter Author Name: ";
        getline(cin, newBook.author);
        newBook.isIssued = false;

        for (auto &b : books) {
            if (b.id == newBook.id) {
                cout << "Book with this ID already exists!\n";
                return;
            }
        }

        books.push_back(newBook);
        cout << "Book added successfully!\n";
        saveToFile();  
    }


    void displayBooks() {
        if (books.empty()) {
            cout << "\nLibrary is empty!\n";
            return;
        }

        cout << "\n===== Library Catalog =====\n";
        for (auto &b : books) {
            cout << "ID: " << b.id << "\n";
            cout << "Title: " << b.title << "\n";
            cout << "Author: " << b.author << "\n";
            cout << "Status: " << (b.isIssued ? "Issued" : "Available") << "\n";
            cout << "-----------------------------\n";
        }
    }


    void issueBook() {
        if (books.empty()) {
            cout << "\nNo books in library!\n";
            return;
        }

        int id;
        cout << "\nEnter Book ID to issue: ";
        cin >> id;

        for (auto &b : books) {
            if (b.id == id) {
                if (b.isIssued) {
                    cout << "Book is already issued.\n";
                    return;
                } else {
                    b.isIssued = true;
                    recentIssued.push(b);
                    cout << "Book issued successfully: " << b.title << "\n";
                    saveToFile();  
                    return;
                }
            }
        }

        cout << "Book with ID " << id << " not found!\n";
    }

    
    void returnBook() {
        if (books.empty()) {
            cout << "\nNo books in library!\n";
            return;
        }

        int id;
        cout << "\nEnter Book ID to return: ";
        cin >> id;

        for (auto &b : books) {
            if (b.id == id) {
                if (!b.isIssued) {
                    cout << "This book was not issued.\n";
                    return;
                } else {
                    b.isIssued = false;
                    cout << "Book returned successfully: " << b.title << "\n";
                    saveToFile();  
                    return;
                }
                
            }
        }

        cout << "Book with ID " << id << " not found!\n";
    }

    
    void searchBookByTitle() {
        if (books.empty()) {
            cout << "\nLibrary is empty!\n";
            return;
        }

        string keyword;
        cout << "\nEnter title keyword to search: ";
        cin.ignore();
        getline(cin, keyword);

        bool found = false;
        cout << "\nSearch Results:\n";
        for (auto &b : books) {
            if (b.title.find(keyword) != string::npos) {
                cout << "ID: " << b.id << "\n";
                cout << "Title: " << b.title << "\n";
                cout << "Author: " << b.author << "\n";
                cout << "Status: " << (b.isIssued ? "Issued" : "Available") << "\n";
                cout << "-----------------------------\n";
                found = true;
            }
        }

        if (!found) {
            cout << "No books found with that keyword.\n";
        }
    }

    
    void deleteBook() {
        if (books.empty()) {
            cout << "\nLibrary is empty!\n";
            return;
        }

        int id;
        cout << "\nEnter Book ID to delete: ";
        cin >> id;

        auto it = remove_if(books.begin(), books.end(), [&](Book &b) {
            return b.id == id;
        });

        if (it != books.end()) {
            books.erase(it, books.end());
            cout << "Book deleted successfully!\n";
            saveToFile();  
        } else {
            cout << "Book with ID " << id << " not found!\n";
        }
    }

    
    void showRecentIssued() {
        if (recentIssued.empty()) {
            cout << "\nNo books recently issued.\n";
            return;
        }

        stack<Book> tempStack = recentIssued;
        cout << "\nRecently Issued Books (latest on top):\n";
        while (!tempStack.empty()) {
            Book b = tempStack.top();
            cout << "ID: " << b.id << " | Title: " << b.title << "\n";
            tempStack.pop();
        }
    }

    
    void sortBooksByTitle() {
        if (books.empty()) {
            cout << "\nLibrary is empty!\n";
            return;
        }

        sort(books.begin(), books.end(), [](Book &a, Book &b) {
            return a.title < b.title;
        });

        cout << "\nBooks sorted by title.\n";
        saveToFile();  
    }

    
    void saveToFile() {
        ofstream outFile(filename);
        for (auto &b : books) {
            outFile << b.id << "," << b.title << "," << b.author << "," << b.isIssued << "\n";
        }
        outFile.close();
    }

    
    void loadFromFile() {
        ifstream inFile(filename);
        if (!inFile) {
            cout << "\nNo previous data found. Starting fresh.\n";
            return;
        }

        books.clear();
        string line;
        while (getline(inFile, line)) {
            stringstream ss(line);
            string idStr, title, author, isIssuedStr;

            getline(ss, idStr, ',');
            getline(ss, title, ',');
            getline(ss, author, ',');
            getline(ss, isIssuedStr, ',');

            Book b;
            b.id = stoi(idStr);
            b.title = title;
            b.author = author;
            b.isIssued = (isIssuedStr == "1");

            books.push_back(b);
        }

        inFile.close();
    }
};


int main() {
    Library lib;
    int choice;

    cout << "===== DIGITAL LIBRARY SYSTEM =====\n";

    do {
        cout << "\n1. Add Book\n2. Display All Books\n3. Issue Book\n4. Return Book\n";
        cout << "5. Search Book by Title\n6. Delete Book\n7. Show Recently Issued\n8. Sort Books by Title\n9. Exit\n";
        cout << "Enter your choice: ";
        cin >> choice;

        switch (choice) {
        case 1: lib.addBook(); break;
        case 2: lib.displayBooks(); break;
        case 3: lib.issueBook(); break;
        case 4: lib.returnBook(); break;
        case 5: lib.searchBookByTitle(); break;
        case 6: lib.deleteBook(); break;
        case 7: lib.showRecentIssued(); break;
        case 8: lib.sortBooksByTitle(); break;
        case 9: cout << "Exiting Library System...\n"; break;
        default: cout << "Invalid choice! Try again.\n";
        }
    } while (choice != 9);

    return 0;
}
