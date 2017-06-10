require 'test_helper'

class DumbRoomControllerTest < ActionDispatch::IntegrationTest
  test "should get show" do
    get dumb_room_show_url
    assert_response :success
  end

end
