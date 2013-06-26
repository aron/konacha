module Konacha
  class Server
    def self.start
      Rack::Server.start(:app => Konacha.application, :Port => Konacha.port, :server => Konacha.server, :AccessLog => [])
    end
  end
end
