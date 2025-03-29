import React from 'react';
import {render, screen} from "@testing-library/react";
import Avatar from '../Avatar';

describe("Avatar Component", () => {

    test("renders with correct initials",  async () => {
        render(<Avatar firstname="Billy" lastname="Bob" color="#3498db" />);

        expect(screen.getByText("BB")).toBeInTheDocument();
    });

    test("renders correct background color", () => {
        const {container} = render(<Avatar fristname="Jane" lastname="Watson" color="#3498db" />);
        expect(container.firstChild).toHaveStyle("background-color: #3498db");
    });

    test("renders right size", () => {
        const {container} = render(<Avatar firstname="Alice" lastname="Brown" color="#3498db" size={60} />);
        expect(container.firstChild).toHaveStyle("width: 60px");
        expect(container.firstChild).toHaveStyle("height: 60px");
    });

    test("renders default size when not given", () => {
        const {container} = render(<Avatar firstname="Emily" lastname="Elizabeth" color="#3498db" />);
        expect(container.firstChild).toHaveStyle("width: 40px");
        expect(container.firstChild).toHaveStyle("height: 40px");
    })

    test("handler missing first or last name", () => {
        render(<Avatar firstname="Sam" lastname="" color="#3498db" />);
        expect(screen.getByText("S")).toBeInTheDocument();

        render(<Avatar firstname="" lastname="Henry" color="#3498db" />);
        expect(screen.getByText("H")).toBeInTheDocument();
    });

    test("handle missing first and last name", () => {
        render(<Avatar firstname="" lastname="" color="#3498db"/>);
        expect(screen.getByText("?")).toBeInTheDocument();
    });
});
