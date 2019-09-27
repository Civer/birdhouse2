class systemChecks {
  runAll() {
    this.checkStagingInDevelopment();
  }

  checkStagingInDevelopment() {
    if (
      process.env.NODE_ENV === "development" &&
      process.env.REACT_APP_STAGING === "true"
    ) {
      console.error(
        "BIRDHOUSE ERROR [4010]:  DEVELOPMENT build uses STAGING environment."
      );
    }
  }
}

export default systemChecks;
