# VUM Athletes ITRA

VUM Athletes ITRA is a web application built with Next.js that showcases information about athletes participating in trail running events, particularly those affiliated with the International Trail Running Association (ITRA).

## Features

*   **Athlete Directory:** Browse a list of trail running athletes.
*   **Athlete Profiles:** View detailed information about each athlete, including:
    *   Bib number
    *   Age
    *   Nationality
    *   Gender
    *   Club affiliation
    *   ITRA Performance Index (PI)
    *   Country flag
    *   Profile picture
*   **Responsive Design:** The application adapts to various screen sizes, providing an optimal experience on both mobile and desktop devices.
* **Modern Design:** Tailwind CSS was used to create the design.

## Technologies Used

*   **Next.js:** A React framework for building web applications.
*   **React:** A JavaScript library for building user interfaces.
*   **TypeScript:** A typed superset of JavaScript for improved code quality.
*   **JSON:** Used for storing static athlete data.
* **Tailwind CSS:** A utility-first CSS framework for styling.

## Data Source

Athlete information is sourced from the `data/runners.json` file. This file contains an array of athletes, with each athlete represented as an array: `[athleteName, athleteDetails]`.

## Getting Started

### Prerequisites

*   **Node.js:** Make sure you have Node.js (version 18 or later recommended) and npm (or yarn) installed.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd vum-athletes-itra
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn
    ```

### Running in Development Mode

1.  **Start the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
2.  **Open your browser:** Navigate to `http://localhost:3000` to view the application.

## Project Structure
## `useIsMobile` Hook

The `useIsMobile` hook is a custom React hook that detects whether the user is on a mobile device. It is defined in `hooks/use-mobile.tsx`.

*   **Mobile Breakpoint:** The breakpoint for mobile devices is set to 768px (screen width less than 768px is considered mobile).
*   **Functionality:**
    *   Uses `window.matchMedia` to listen for changes in screen size.
    *   Returns a boolean indicating whether the device is mobile.

## Contributing

Contributions are welcome! If you'd like to contribute to this project, please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your changes.
3.  Make your changes and commit them.
4.  Push your changes to your fork.
5.  Submit a pull request.