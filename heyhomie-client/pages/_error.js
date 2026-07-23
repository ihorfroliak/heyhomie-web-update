import React from 'react';
import ErrorPage from 'next/error';

export default class Page extends React.Component {
    static async getInitialProps(ctx) {
        return ErrorPage.getInitialProps(ctx);
    }

    render() {
        return <ErrorPage statusCode={this.props.statusCode || '¯\\_(ツ)_/¯'} />;
    }
}
